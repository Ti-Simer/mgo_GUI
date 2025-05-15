// request.store.ts
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { RequestService } from 'src/app/services/poseidon-services/request.service';
import { EMPTY } from 'rxjs';

export interface RequestState {
    request: any[];
    total: number;
    page: number;
    pageSize: number;
    searchDateFrom: string | null;
    searchDateTo: string | null;
    propane_truck: string | null;
    loading: boolean;
    sortBy: string;        // p.ej. 'folio' o 'create'
    sortDirection: 'asc' | 'desc';
}

const initialState: RequestState = {
    request: [],
    total: 0,
    page: 1,
    pageSize: 50,
    searchDateFrom: null,
    searchDateTo: null,
    propane_truck: null,
    loading: false,
    sortBy: 'create',
    sortDirection: 'desc',
};

@Injectable()
export class RequestStore extends ComponentStore<RequestState> {
    constructor(private requestService: RequestService) {
        super(initialState);
    }

    // ─── Selectors ───────────────────────────────────────────────────────────

    readonly request$ = this.select(state => state.request);
    readonly total$ = this.select(state => state.total);
    readonly page$ = this.select(state => state.page);
    readonly pageSize$ = this.select(state => state.pageSize);
    readonly loading$ = this.select(state => state.loading);
    readonly searchDateFrom$ = this.select(state => state.searchDateFrom);
    readonly searchDateTo$ = this.select(state => state.searchDateTo);
    readonly propaneTruck$ = this.select(state => state.propane_truck);


    readonly setSort = this.updater<{ by: string; dir: 'asc' | 'desc' }>((state, { by, dir }) => {
        const getNestedValue = (obj: any, path: string) => {
            return path.split('.').reduce((acc, key) => acc && acc[key], obj);
        };

        const sortedRequest = [...state.request].sort((a, b) => {
            const aVal = getNestedValue(a, by);
            const bVal = getNestedValue(b, by);
            const comp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return dir === 'asc' ? comp : -comp;
        });

        return {
            ...state,
            request: sortedRequest, // Actualiza el estado con los datos ordenados
            sortBy: by,
            sortDirection: dir,
        };
    });

    // ─── Updaters ────────────────────────────────────────────────────────────

    readonly setPage = this.updater<number>((state, page) => ({
        ...state,
        page,
    }));

    readonly setPageSize = this.updater<number>((state, pageSize) => ({
        ...state,
        pageSize,
    }));

    readonly setFilters = this.updater<{
        from: string | null;
        to: string | null;
        propane_truck: string | null;
    }>((state, { from, to, propane_truck }) => ({
        ...state,
        searchDateFrom: from,
        searchDateTo: to,
        propane_truck,
        page: 1,  // resetear página
    }));

    // ─── Effects ─────────────────────────────────────────────────────────────

    readonly loadRequest = this.effect<void>(trigger$ =>
        trigger$.pipe(
            tap(() => this.patchState({ loading: true })),
            withLatestFrom(
                this.page$,
                this.pageSize$,
                this.searchDateFrom$,
                this.searchDateTo$,
                this.propaneTruck$
            ),
            switchMap(([_, page, pageSize, dateFrom, dateTo, propaneTruck]) => {
                const payload = { pageData: { page, limit: pageSize } };

                const call$ = dateFrom
                    ? this.requestService.getByQuery({
                        date: dateFrom,
                        date2: dateTo,
                        propane_truck: propaneTruck
                    })
                    : this.requestService.getAll(payload);

                return call$.pipe(
                    tap({
                        next: (response: any) => {
                            if (response.statusCode === 200) {
                                const data = dateFrom
                                    ? {
                                        request: response.data.sort(/*…*/),
                                        total: response.data.length
                                    }
                                    : {
                                        request: response.data.requests.sort(/*…*/),
                                        total: response.data.total
                                    };
                                this.patchState({
                                    request: data.request,
                                    total: data.total,
                                    loading: false,
                                });
                            } else {
                                this.patchState({ request: [], total: 0, loading: false });
                            }
                        },
                        error: () => this.patchState({ loading: false })
                    })
                );
            })
        )
    );


}


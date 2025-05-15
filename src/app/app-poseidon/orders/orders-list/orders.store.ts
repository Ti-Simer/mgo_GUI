// orders.store.ts
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { OrdersService } from 'src/app/services/poseidon-services/orders.service';
import { EMPTY } from 'rxjs';

export interface OrdersState {
    orders: any[];
    total: number;
    page: number;
    pageSize: number;
    searchDateFrom: string | null;
    searchDateTo: string | null;
    loading: boolean;
    sortBy: string;        // p.ej. 'folio' o 'create'
    sortDirection: 'asc' | 'desc';
}

const initialState: OrdersState = {
    orders: [],
    total: 0,
    page: 1,
    pageSize: 50,
    searchDateFrom: null,
    searchDateTo: null,
    loading: false,
    sortBy: 'create',
    sortDirection: 'desc',
};

@Injectable()
export class OrdersStore extends ComponentStore<OrdersState> {
    constructor(private ordersService: OrdersService) {
        super(initialState);
    }

    // ─── Selectors ───────────────────────────────────────────────────────────

    readonly orders$ = this.select(state => state.orders);
    readonly total$ = this.select(state => state.total);
    readonly page$ = this.select(state => state.page);
    readonly pageSize$ = this.select(state => state.pageSize);
    readonly loading$ = this.select(state => state.loading);
    readonly searchDateFrom$ = this.select(state => state.searchDateFrom);
    readonly searchDateTo$ = this.select(state => state.searchDateTo);

    readonly setSort = this.updater<{ by: string; dir: 'asc' | 'desc' }>((state, { by, dir }) => {
        const getNestedValue = (obj: any, path: string) => {
            return path.split('.').reduce((acc, key) => acc && acc[key], obj);
        };

        const sortedOrders = [...state.orders].sort((a, b) => {
            const aVal = getNestedValue(a, by);
            const bVal = getNestedValue(b, by);
            const comp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return dir === 'asc' ? comp : -comp;
        });

        return {
            ...state,
            orders: sortedOrders, // Actualiza el estado con los datos ordenados
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

    readonly setSearchDates = this.updater<{ from: string | null; to: string | null }>(
        (state, { from, to }) => ({
            ...state,
            searchDateFrom: from,
            searchDateTo: to,
            page: 1,            // resetear a página 1 al cambiar filtro
        })
    );

    // ─── Effects ─────────────────────────────────────────────────────────────

    readonly loadOrders = this.effect<void>(trigger$ =>
        trigger$.pipe(
            tap(() => this.patchState({ loading: true })),
            withLatestFrom(
                this.page$,
                this.pageSize$,
                this.searchDateFrom$,
                this.searchDateTo$
            ),
            switchMap(([_, page, pageSize, dateFrom, dateTo]) => {
                const payload: any = {
                    pageData: { page, limit: pageSize },
                };
                // Si tiene filtros de fecha, usar getByQuery; sino getAll
                const call$ = dateFrom
                    ? this.ordersService.getByQuery({ date: dateFrom, date2: dateTo })
                    : this.ordersService.getAll(payload);

                return call$.pipe(
                    tap({
                        next: (response: any) => {
                            if (response.statusCode === 200) {
                                // Normalizar respuesta de ambos endpoints
                                const data = dateFrom ? {
                                    orders: response.data.sort((a: any, b: any) =>
                                        new Date(b.internal_folio).getTime() - new Date(a.internal_folio).getTime()
                                    ),
                                    total: response.data.length
                                } : {
                                    orders: response.data.orders.sort((a: any, b: any) =>
                                        new Date(b.folio).getTime() - new Date(a.folio).getTime()
                                    ),
                                    total: response.data.total
                                };
                                this.patchState({
                                    orders: data.orders,
                                    total: data.total,
                                    loading: false,
                                });
                            } else {
                                this.patchState({ orders: [], total: 0, loading: false });
                            }
                        },
                        error: () => this.patchState({ loading: false }),
                    })
                );
            })
        )
    );

}

export interface FavoriteMutate {
    product_id: number;
    customer_id: number;
}

export interface Favorite extends FavoriteMutate {
    id: number;
}

export interface FavoriteFilter extends Partial<Favorite> {}

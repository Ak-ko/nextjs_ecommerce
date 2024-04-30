const PRICE_FORMATTER = new Intl.NumberFormat("en-us", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
});
export const formatCurrency = (amount: number): string => {
    if (!amount) return "";
    return PRICE_FORMATTER.format(amount);
};

const NUMBER_FORMATTER = new Intl.NumberFormat("en-us");
export const formatNumber = (num: number | string | any): string => {
    if (!num) return "";
    return NUMBER_FORMATTER.format(num);
};

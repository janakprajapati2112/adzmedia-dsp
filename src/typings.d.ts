/* SystemJS module definition */
declare var module: NodeModule;
declare var StripeCheckout: any;
interface NodeModule {
    id: string;
}
interface JQuery {
    mMenu(options: any): JQuery;
    animateClass(options: any): JQuery;
    setActiveItem(item: any): JQuery;
    getPageTitle(item: any): JQuery;
    getBreadcrumbs(item: any): JQuery;
    validate(options: any): JQuery;
    valid(): JQuery;
    resetForm(): JQuery;
    markdown(): JQuery;
}
declare module 'mongoose' {
    interface DocumentQuery<
        T,
        DocType extends import('mongoose').Document,
        QueryHelpers = {}
    > {
        sort:Promise<DocumentQuery<T[], Document> & QueryHelpers>
        limit: Promise<DocumentQuery<T[], Document> & QueryHelpers>
        paginate:Promise<DocumentQuery<T[], Document> & QueryHelpers>
        exec: DocType
    }

    interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType>
        extends DocumentQuery<any, any> {}
}
    
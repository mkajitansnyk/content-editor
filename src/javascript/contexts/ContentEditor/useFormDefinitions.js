import {useQuery} from '@apollo/react-hooks';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useContentEditorConfigContext} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';

export const useFormDefinition = (query, adapter) => {
    const {t} = useTranslation();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {lang, uilang, uuid, contentType} = contentEditorConfigContext;

    // Get Data
    const formQueryParams = {
        uuid,
        language: lang,
        uilang: Constants.supportedLocales.includes(uilang) ? uilang : Constants.defaultLocale,
        primaryNodeType: contentType,
        writePermission: `jcr:modifyProperties_default_${lang}`,
        childrenFilterTypes: Constants.childrenFilterTypes
    };

    const {loading, error, data, refetch} = useQuery(query, {
        variables: formQueryParams,
        fetchPolicy: 'network-only'
    });

    const dataCached = useMemo(() => {
        if (!error && !loading && data.jcr) {
            return adapter(data, formQueryParams.uilang, t, contentEditorConfigContext);
        }
    }, [data, formQueryParams.uilang, t, contentEditorConfigContext, error, loading, adapter]);

    if (error || loading || !data.jcr) {
        return {
            loading,
            error,
            formQueryParams,
            errorMessage: error && t('content-editor:label.contentEditor.error.queryingContent', {details: (error.message ? error.message : '')})
        };
    }

    return {data: dataCached, formQueryParams, refetch};
};

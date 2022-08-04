import React from 'react';
import {File} from '@jahia/moonstone';
import {useQuery} from '@apollo/react-hooks';
import {ContentPickerFilledQuery} from './ContentPicker.gql-queries';
import {encodeJCRPath} from '~/utils';
import {useContentEditorContext} from '~/contexts';

const usePickerInputData = uuids => {
    const {lang} = useContentEditorContext();

    const {data, error, loading} = useQuery(ContentPickerFilledQuery, {
        variables: {
            uuids: uuids || [],
            language: lang
        },
        skip: !uuids
    });

    if (loading || error || !data || !data.jcr || !uuids) {
        return {error, loading, notFound: Boolean(uuids)};
    }

    const fieldData = data.jcr.result.map(contentData => ({
        uuid: contentData.uuid,
        path: contentData.path,
        url: encodeJCRPath(`${contentData.primaryNodeType.icon}.png`),
        name: contentData.displayName,
        info: contentData.primaryNodeType.displayName
    }));

    return {fieldData, error, loading};
};

export const ContentPickerConfig = {
    pickerInput: {
        emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addContent',
        notFoundLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.notFoundContent',
        emptyIcon: <File/>,
        usePickerInputData
    },
    pickerDialog: {
        view: 'List',
        dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalTitle',
        searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchPlaceholder',
        displayTree: true,
        displaySiteSwitcher: true
    }
};

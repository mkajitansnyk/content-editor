import React from 'react';
import {AccordionItem} from '@jahia/moonstone';
import {
    cePickerClosePaths,
    cePickerOpenPaths,
    cePickerPath
} from '~/SelectorTypes/Picker/Picker2.redux';
import {batchActions} from 'redux-batched-actions';
import {ContentTree} from '@jahia/jcontent';

const selector = state => ({
    siteKey: state.contenteditor.picker.site,
    lang: state.language,
    path: state.contenteditor.picker.searchContext === '' ? state.contenteditor.picker.path : state.contenteditor.picker.searchContext,
    openPaths: state.contenteditor.picker.openPaths
});

const actions = {
    setPathAction: path => batchActions([cePickerPath(path)]),
    openPathAction: path => cePickerOpenPaths([path]),
    closePathAction: path => cePickerClosePaths([path])
};

export const renderer = {
    render: (v, item) => (
        <AccordionItem key={v.id} id={v.id} label={v.label} icon={v.icon}>
            <ContentTree refetcherType="cePickerRefetcher" item={item} selector={selector} {...actions} isReversed={false}/>
        </AccordionItem>
    )
};

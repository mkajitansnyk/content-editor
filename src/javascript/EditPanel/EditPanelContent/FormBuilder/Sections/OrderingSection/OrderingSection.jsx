import {useTranslation} from 'react-i18next';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';
import {ChildrenSection} from '~/EditPanel/EditPanelContent/FormBuilder/Sections';
import React from 'react';
import PropTypes from 'prop-types';
import {SectionPropTypes} from '~/FormDefinitions';
import {Collapsible} from '@jahia/moonstone';

export const OrderingSection = ({mode, section, nodeData, isExpanded, onClick}) => {
    const {t} = useTranslation('content-editor');

    const {values} = useFormikContext();
    const canAutomaticallyOrder = values && values[Constants.automaticOrdering.mixin] !== undefined;
    const canManuallyOrder = nodeData.primaryNodeType.hasOrderableChildNodes;

    const isOrderingSection = !nodeData.isSite && !nodeData.isPage && (canManuallyOrder || canAutomaticallyOrder) && mode === Constants.routes.baseEditRoute;

    if (isOrderingSection) {
        const sec = {
            isOrderingSection: true,
            displayName: t('content-editor:label.contentEditor.section.listAndOrdering.title'),
            fieldSets: section.fieldSets.filter(f => f.name !== 'jmix:orderedList')
        };

        return (
            <Collapsible data-sel-content-editor-fields-group={sec.displayName}
                         label={sec.displayName}
                         isExpanded={isExpanded}
                         onClick={onClick}
            >
                <ChildrenSection
                    displayName={sec.displayName}
                    section={sec}
                    canAutomaticallyOrder={canAutomaticallyOrder}
                    canManuallyOrder={canManuallyOrder}
                />
            </Collapsible>
        );
    }

    return false;
};

OrderingSection.propTypes = {
    mode: PropTypes.string.isRequired,
    nodeData: PropTypes.object.isRequired,
    section: SectionPropTypes.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

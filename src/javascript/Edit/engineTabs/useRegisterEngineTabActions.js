import {useEffect} from 'react';
import {engineTabsPermissionCheckQuery} from '~/Edit/engineTabs/engineTabs.permission.gql-query';
import {registry} from '@jahia/ui-extender';
import openEngineTabsAction from '~/Edit/engineTabs/openEngineTabs.action';
import {getNodeTypes} from './engineTabs.utils';
import {useQuery} from '@apollo/react-hooks';
import {useContentEditorContext} from '~/ContentEditor.context';

/**
 * This function register the actions related to the GWT engine tabs
 */
export const useRegisterEngineTabActions = () => {
    const {nodeData, site} = useContentEditorContext();
    const {path, displayName, uuid, mixinTypes, primaryNodeType} = nodeData;

    // Get tabs from GWT authoring API
    const tabs = window.authoringApi.getEditTabs(
        path,
        uuid,
        displayName,
        mixinTypes.map(mixinType => mixinType.name),
        getNodeTypes(primaryNodeType),
        primaryNodeType.hasOrderableChildNodes
    );

    // SINCE DX 7.5 this fct is introduce, not usable by previous DX version
    if (!window.authoringApi.getEditTabs) {
        console.warn('DX version is not able to load GWT engine tabs in content editor');
    }

    const {loading, error, data} = useQuery(engineTabsPermissionCheckQuery(tabs, site));

    useEffect(() => {
        if (!error && !loading) {
            if (tabs) {
                // Permission check query
                const actionPrefix = 'contentEditorGWTTabAction_';
                const actionStartPriority = 3;

                tabs
                    .forEach((tab, index) => {
                        if (!registry.get(actionPrefix + tab.id) && (!tab.requiredPermission || data.jcr.nodeByPath[tab.id])) {
                            registry.addOrReplace('action', actionPrefix + tab.id, openEngineTabsAction, {
                                buttonLabel: tab.title,
                                targets: ['AdvancedOptionsActions:' + (index + actionStartPriority)],
                                tabs: [tab.id]
                            });
                        }
                    });
            }
        }
    }, [data, error, loading]);

    return {loading, error};
};

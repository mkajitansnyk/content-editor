import React from 'react';
import PropTypes from 'prop-types';

import {ButtonGroup, Chip, Typography} from '@jahia/moonstone';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {truncate} from '~/utils/helper';
import styles from './UpperSection.scss';
import ContentBreadcrumb from '~/EditPanel/header/ContentBreadcrumb';
import {useContentEditorContext} from '~/ContentEditor.context';
import {UnsavedChip} from '~/EditPanel/header/UnsavedChip';
import {PublishMenu} from '~/EditPanel/header/PublishMenu';
import {getButtonRenderer} from '~/utils/getButtonRenderer';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {
        size: 'big',
        color: 'accent',
        className: styles.mainActions
    }
});

const BackButtonRenderer = getButtonRenderer({
    labelStyle: 'none'
});

export const HeaderUpperSection = ({title, isShowPublish}) => {
    const {nodeData, nodeTypeDisplayName} = useContentEditorContext();

    return (
        <>
            <div className={styles.padder}/>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <DisplayAction
                        actionKey="backButton"
                        render={BackButtonRenderer}
                    />

                    <Typography isNowrap className={styles.headerTypography} variant="title" data-sel-role="title">
                        {truncate(title, 60)}
                    </Typography>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.saveActions}>
                        <DisplayActions
                            target="content-editor/header/main-save-actions"
                            render={ButtonRenderer}
                        />
                    </div>

                    {isShowPublish && (
                        <ButtonGroup
                            color="accent"
                            size="big"
                            className={styles.publishActions}
                        >
                            <DisplayActions
                                isMainButton
                                target="content-editor/header/main-publish-actions"
                                render={ButtonRenderer}
                            />

                            <PublishMenu/>
                        </ButtonGroup>
                    )}
                </div>
            </div>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    {nodeData?.path?.startsWith('/sites') ?
                        <ContentBreadcrumb path={nodeData.path}/> :
                        <Chip label={nodeTypeDisplayName} color="accent"/>}
                </div>

                <div className={styles.headerChips}>
                    <PublicationInfoBadge/>
                    <LockInfoBadge/>
                    <WipInfoChip/>
                    <UnsavedChip/>
                </div>
            </div>
        </>
    );
};

HeaderUpperSection.propTypes = {
    title: PropTypes.string.isRequired,
    isShowPublish: PropTypes.bool
};

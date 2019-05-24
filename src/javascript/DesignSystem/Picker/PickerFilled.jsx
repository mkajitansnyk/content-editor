import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {compose} from 'react-apollo';
import {Typography} from '@jahia/ds-mui-theme';
import {DisplayActions} from '@jahia/react-material';
import IconButton from '@material-ui/core/IconButton';
import {translate} from 'react-i18next';

const styles = theme => ({
    fieldContainer: {
        height: theme.spacing.unit * 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // TODO border: `1px ${theme.palette.ui.zeta} solid`,
        border: '1px #C1C8D5 solid',
        boxShadow: '1px 5px 6px rgba(64, 77, 86, 0.1)',
        borderRadius: '2px',
        paddingRight: theme.spacing.unit
    },
    fieldContainerReadOnly: {
        border: `1px ${theme.palette.ui.omega} solid`,
        boxShadow: 'none'
    },
    fieldFigureContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `calc(${theme.spacing.unit * 9}px - 2px)`,
        width: theme.spacing.unit * 9,
        overflow: 'hidden',
        backgroundColor: theme.palette.ui.omega
    },
    fieldImage: {
        textAlign: 'center',
        margin: 0,
        maxWidth: theme.spacing.unit * 9,
        maxHeight: `calc(${theme.spacing.unit * 9}px - 2px)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
    },
    fieldSelectedMetadata: {
        flexGrow: 1,
        padding: '1rem 2rem',
        width: 'calc(100% - 144px)',
        '& p': {
            width: '360px',
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    actionButton: {
        color: theme.palette.font.beta
    }
});

const PickerFilledCmp = ({readOnly, field, fieldData, classes}) => {
    return (
        <article className={classes.fieldContainer + ' ' + (readOnly ? classes.fieldContainerReadOnly : '')} data-sel-field-picker="filled">
            <div className={classes.fieldFigureContainer}>
                <img src={fieldData.url}
                     className={classes.fieldImage}
                />
            </div>
            <div className={classes.fieldSelectedMetadata}>
                <Typography data-sel-field-picker-name variant="zeta" color="alpha">
                    {fieldData.name}
                </Typography>
                <Typography data-sel-field-picker-info variant="omega" color="gamma">
                    {fieldData.info}
                </Typography>
            </div>
            <DisplayActions
                context={{field}}
                target="unsetFieldActions"
                render={({context}) => {
                    return (
                        <IconButton
                            data-sel-field-picker-action={context.actionKey}
                            className={classes.actionButton}
                            onClick={e => {
                                context.onClick(context, e);
                            }}
                        >
                            {context.buttonIcon}
                        </IconButton>
                    );
                }}
            />
        </article>
    );
};

PickerFilledCmp.defaultProps = {
    readOnly: false
};

PickerFilledCmp.propTypes = {
    readOnly: PropTypes.bool,
    field: PropTypes.object.isRequired,
    fieldData: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export const PickerFilled = compose(
    translate(),
    withStyles(styles)
)(PickerFilledCmp);

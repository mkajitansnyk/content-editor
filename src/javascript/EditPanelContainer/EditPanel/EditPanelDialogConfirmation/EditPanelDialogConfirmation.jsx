import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as PropTypes from 'prop-types';
import React from 'react';
import {translate} from 'react-i18next';
import EditPanelConstants from '../EditPanelConstants';

export const EditPanelDialogConfirmation = ({t, titleKey, open, onCloseDialog, actionCallback, formik}) => {
    const handleDiscard = () => {
        onCloseDialog();

        actionCallback();
    };

    const handleSave = () => {
        onCloseDialog();

        const {setFieldValue, submitForm} = formik;
        setFieldValue(EditPanelConstants.systemFields.SYSTEM_SUBMIT_OPERATION, EditPanelConstants.submitOperation.SAVE, false);

        submitForm().then(() => actionCallback());
    };

    return (
        <Dialog aria-labelledby="alert-dialog-slide-title"
                open={open}
                onClose={onCloseDialog}
        >
            <DialogTitle id="alert-dialog-slide-title">
                {t(titleKey)}
            </DialogTitle>
            <DialogActions>
                <Button color="default" onClick={onCloseDialog}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnContinue')}
                </Button>
                <Button color="default" onClick={handleDiscard}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnDiscard')}
                </Button>
                <Button color="primary" onClick={handleSave}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnSave')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditPanelDialogConfirmation.propTypes = {
    t: PropTypes.func.isRequired,
    titleKey: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

EditPanelDialogConfirmation.displayName = 'EditPanelDialogConfirmation';

export default translate()(EditPanelDialogConfirmation);

import React from 'react';
import {Toggle} from '@jahia/design-system-kit';
import {Typography} from '@jahia/moonstone';
import {FieldSetPropTypes} from '~/ContentEditor.proptypes';
import {FieldContainer} from '../Field';
import {useFormikContext} from 'formik';
import styles from './FieldSet.scss';

export const FieldSet = ({fieldset}) => {
    const {values, handleChange} = useFormikContext();
    const activatedFieldSet = !fieldset.dynamic || (values && values[fieldset.name]);

    return (
        <article className={activatedFieldSet && fieldset.fields.length > 0 ? styles.fieldSetOpen : styles.fieldSet}>
            {!fieldset.hideHeader && (
                <div className={styles.fieldSetTitleContainer}>
                    <div className="flexRow_nowrap">
                        {fieldset.dynamic && (
                            <Toggle
                                classes={{
                                    root: styles.toggle
                                }}
                                data-sel-role-dynamic-fieldset={fieldset.name}
                                id={fieldset.name}
                                checked={activatedFieldSet}
                                readOnly={fieldset.readOnly}
                                onChange={handleChange}
                            />
                        )}
                        <div className="flexCol">
                            <Typography component="label"
                                        htmlFor={fieldset.name}
                                        className={styles.fieldSetTitle}
                                        variant="subheading"
                                        weight="bold"
                            >
                                {fieldset.displayName}
                            </Typography>
                            {fieldset.description && (
                                <Typography component="label" className={styles.fieldSetDescription} variant="caption">
                                    {fieldset.description}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.fields}>
                {activatedFieldSet && fieldset.fields.map(field => <FieldContainer key={field.name} field={field}/>)}
            </div>
        </article>
    );
};

FieldSet.propTypes = {
    fieldset: FieldSetPropTypes.isRequired
};


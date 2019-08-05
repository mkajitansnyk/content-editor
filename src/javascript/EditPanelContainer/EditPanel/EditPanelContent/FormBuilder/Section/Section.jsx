import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';

import {SectionPropTypes} from '../../../../FormDefinitions/FormData.proptypes';
import {FieldSet} from './FieldSet';

let styles = theme => ({
    section: {
        borderBottom: `1px solid ${theme.palette.ui.omega}`,
        paddingBottom: theme.spacing.unit * 2
    },
    sectionTitle: {
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
    }
});

const SectionCmp = ({section, classes}) => {
    const hideFieldSets = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and one of the following condition:
        // - FieldSet doesn't contain any fields (empty)
        // - FieldSet contains only one readOnly field
        // - FieldSet has more than one field and all fields are readOnly
        return !fieldSet.dynamic &&
            (
                (fieldSet.fields.length === 0) ||
                (fieldSet.fields.length === 1 && fieldSet.fields[0].readOnly) ||
                (fieldSet.fields.length > 1 && fieldSet.fields.reduce((result, field) => result && field.readOnly, true))
            );
    };

    return (
        <section className={classes.section} data-sel-content-editor-fields-group={section.displayName}>
            <Typography component="h2" className={classes.sectionTitle} color="alpha" variant="gamma">{section.displayName}</Typography>

            {section.fieldSets.map(fieldset => {
                if (hideFieldSets(fieldset)) {
                    return null;
                }

                return <FieldSet key={fieldset.displayName} fieldset={fieldset}/>;
            })}
        </section>
    );
};

SectionCmp.propTypes = {
    section: SectionPropTypes.isRequired,
    classes: PropTypes.object.isRequired
};

export const Section = withStyles(styles)(SectionCmp);
Section.displayName = 'Section';

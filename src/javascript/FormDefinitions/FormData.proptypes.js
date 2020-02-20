import PropTypes from 'prop-types';

export const FieldPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    i18n: PropTypes.bool,
    selectorType: PropTypes.string,
    mandatory: PropTypes.bool,
    readOnly: PropTypes.bool,
    requiredType: PropTypes.string
});
export const FieldSetPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(FieldPropTypes)
});
export const SectionPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    fieldSets: PropTypes.arrayOf(FieldSetPropTypes)
});

export const ChildrenSectionPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired
});

export const SectionsPropTypes = PropTypes.arrayOf(SectionPropTypes);

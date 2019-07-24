import PropTypes from 'prop-types';

const LabelledValue = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
});

export const DetailsPropTypes = PropTypes.arrayOf(LabelledValue);
export const TechnicalInfoPropTypes = PropTypes.arrayOf(LabelledValue);

export const FieldPropTypes = PropTypes.shape({
    targets: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    formDefinition: PropTypes.shape({
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string,
        readOnly: PropTypes.bool.isRequired,
        multiple: PropTypes.bool,
        selectorType: PropTypes.string.isRequired,
        selectorOptions: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        })),
        valueConstraints: PropTypes.arrayOf(PropTypes.shape({
            displayValue: PropTypes.string.isRequired,
            value: PropTypes.shape({
                string: PropTypes.string.isRequired
            }).isRequired
        }))
    }).isRequired,
    jcrDefinition: PropTypes.shape({

    }).isRequired,
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object
        ]),
        values: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.object
            ])
        )
    })
});

export const FieldsPropTypes = PropTypes.arrayOf(FieldPropTypes);

export const NodeDataPropTypes = PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    primaryNodeType: PropTypes.shape({
        displayName: PropTypes.string
    }).isRequired,
    aggregatedPublicationInfo: PropTypes.shape({
        publicationStatus: PropTypes.string.isRequired
    }).isRequired
});

export const FieldSetPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired
});
export const SectionPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    fieldsets: PropTypes.arrayOf(FieldSetPropTypes)
});
export const SectionsPropTypes = PropTypes.arrayOf(SectionPropTypes);

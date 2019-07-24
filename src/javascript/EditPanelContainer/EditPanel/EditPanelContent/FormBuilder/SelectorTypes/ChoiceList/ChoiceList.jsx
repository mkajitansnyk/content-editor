import React from 'react';
import {FieldPropTypes} from '../../../../../FormDefinitions/FormData.proptypes';

import SingleSelect from './SingleSelect/SingleSelect';
import MultipleSelect from './MultipleSelect/MultipleSelect';

export const ChoiceList = ({field, ...props}) => {
    if (field.formDefinition.multiple) {
        return <MultipleSelect field={field} {...props}/>;
    }

    return <SingleSelect field={field} {...props}/>;
};

ChoiceList.propTypes = {
    field: FieldPropTypes.isRequired
};

export default ChoiceList;

import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';

import {Field} from './Field';
import {dsGenericTheme} from '@jahia/design-system-kit';
import Text from './SelectorTypes/Text/Text';

describe('Field component', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            classes: {},
            siteInfo: {languages: []},
            field: {
                name: 'text',
                displayName: 'displayName',
                nodeType: {
                    properties: [
                        {
                            name: 'text',
                            displayName: 'Text'
                        }
                    ]
                },
                readOnly: false,
                selectorType: 'DatePicker',
                selectorOptions: []
            },
            editorContext: {},
            fieldComponentKey: 'fieldComponentKeyForSelenium',
            labelHtmlFor: 'yoloHtmlFor',
            selectorType: {
                cmp: () => <div>test</div>,
                key: 'test'
            },
            formik: {},
            t: i18nKey => i18nKey,
            dxContext: {},
            actionContext: {},
            input: <></>,
            inputContext: {},
            idInput: 'FieldID'
        };
    });

    it('should render a "Shared in all languages" when field is not i18n and site have multiple languages', () => {
        let lang1 = {
            displayName: 'Deutsch',
            language: 'de',
            activeInEdit: true
        };
        let lang2 = {
            displayName: 'English',
            language: 'en',
            activeInEdit: true
        };

        const testI18nBadgeRender = (
            i18n,
            siteLanguages,
            expectedBadgeRendered
        ) => {
            defaultProps.field = {
                name: 'text',
                displayName: 'text',
                readOnly: false,
                selectorOptions: [],
                nodeType: {
                    properties: [
                        {
                            name: 'text',
                            displayName: 'Text'
                        }
                    ]
                },
                selectorType: 'Text',
                i18n: i18n
            };
            defaultProps.siteInfo = {
                languages: siteLanguages
            };

            const cmp = shallowWithTheme(
                <Field {...defaultProps}><div>test</div></Field>,
                {},
                dsGenericTheme
            )
                .dive()
                .dive();

            const badgeComponent = cmp.find({
                badgeContent:
                    'content-editor:label.contentEditor.edit.sharedLanguages'
            });
            expect(badgeComponent.exists()).toBe(expectedBadgeRendered);
        };

        testI18nBadgeRender(false, [lang1, lang2], true);
        testI18nBadgeRender(true, [lang1, lang2], false);
        testI18nBadgeRender(false, [lang1], false);
        testI18nBadgeRender(true, [lang1], false);
    });

    it('should add htmlFor to the label', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = false;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().dive().debug()).toContain('htmlFor="FieldID"');
    });

    it('should not add htmlFor to the label when field is multiple', () => {
        defaultProps.input = props => <Text {...props}/>;
        defaultProps.field.multiple = true;
        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().dive().debug()).not.toContain('htmlFor="FieldID"');
    });

    it('should display the contextualMenu when action exists', () => {
        defaultProps.actionContext.noAction = false;

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().dive().debug()).toContain('ContextualMenu');
    });

    it('should not display the contextualMenu when action does not exist', () => {
        defaultProps.actionContext.noAction = true;

        const cmp = shallowWithTheme(
            <Field {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().dive().debug()).not.toContain('ContextualMenu');
    });
});

import {
    Accordion,
    BasePage,
    Button,
    Dropdown,
    getComponent,
    getComponentByAttr,
    getComponentByRole,
    getElement,
    SecondaryNav,
    Table,
    TableRow
} from '@jahia/cypress';
import {CreateContent} from './createContent';
import {ContentEditor} from './contentEditor';

export class JContent extends BasePage {
    secondaryNav: SecondaryNav;
    accordion: Accordion;
    siteSwitcher: Dropdown;
    languageSwitcher: Dropdown;

    static visit(site: string, language: string, path: string): JContent {
        cy.visit(`/jahia/jcontent/${site}/${language}/${path}`);
        return new JContent();
    }

    getSecondaryNav(): SecondaryNav {
        if (!this.secondaryNav) {
            this.secondaryNav = getComponent(SecondaryNav);
        }

        return this.secondaryNav;
    }

    getSecondaryNavAccordion(): Accordion {
        if (!this.accordion) {
            this.accordion = getComponent(Accordion, this.getSecondaryNav());
        }

        return this.accordion;
    }

    createContent(contentType: string): ContentEditor {
        return this.getCreateContent()
            .open()
            .getContentTypeSelector()
            .searchForContentType(contentType)
            .selectContentType(contentType)
            .create();
    }

    editComponentByText(text: string) {
        const row = new TableRow(getElement(TableRow.defaultSelector, this.getTable()).contains(text));
        row.contextMenu().select('Edit');
        return new ContentEditor();
    }

    getSiteSwitcher(): Dropdown {
        if (!this.siteSwitcher) {
            this.siteSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'site-switcher');
        }

        return this.siteSwitcher;
    }

    getLanguageSwitcher(): Dropdown {
        if (!this.languageSwitcher) {
            this.languageSwitcher = getComponentByAttr(Dropdown, 'data-cm-role', 'language-switcher');
        }

        return this.languageSwitcher;
    }

    getTable(): Table {
        return getComponent(Table, null, el => expect(el).to.be.visible);
    }

    getCreateContent(): CreateContent {
        return new CreateContent(this);
    }

    selectAccordion(accordion: string): JContent {
        this.getSecondaryNavAccordion().click(accordion);
        return this;
    }

    switchToMode(name: string): JContent {
        getComponentByRole(Button, `sel-view-mode-${name}`).click();
        return this;
    }

    switchToGridMode(): JContent {
        this.switchToMode('grid');
        return this;
    }

    switchToListMode(): JContent {
        this.switchToMode('list');
        return this;
    }

    switchToFlatList(): JContent {
        this.switchToMode('flatList');
        return this;
    }

    switchToStructuredView(): JContent {
        this.switchToMode('structuredView');
        return this;
    }
}

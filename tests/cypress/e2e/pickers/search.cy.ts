import { PageComposer } from '../../page-object/pageComposer'
import { JContent } from '../../page-object/jcontent'

describe('Picker - Search', () => {
    const siteKey = 'digitall'
    let jcontent: JContent
    beforeEach(() => {
        // I have issues adding these to before()/after() so have to add to beforeEach()/afterEach()
        cy.login() // edit in chief

        // beforeEach()
        jcontent = JContent.visit(siteKey, 'en', 'pages/home')
    })

    afterEach(() => {
        cy.logout()
    })

    // tests
    it('Media Picker - Search for tab - letter by letter', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:imgView_image').open()
        picker.search('t')
        picker.verifyResultsLength(24)
        picker.search('a')
        picker.verifyResultsLength(6)
        picker.search('b')
        picker.verifyResultsLength(1)
        picker.getTableRow('person-smartphone-office-table.jpg').should('be.visible')
    })

    it('Media Picker - Search for tab - in different context', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:imgView_image').open()
        picker.search('tab')
        picker.verifyResultsLength(1)
        picker.getTableRow('person-smartphone-office-table.jpg').should('be.visible')
        picker.switchSearchContext('Media')
        picker.verifyResultsLength(3)
        picker.getTableRow('portrait-taber.jpg').should('be.visible')
        picker.getTableRow('portrait-taber.png').should('be.visible')
    })

    it('Media Picker - Search for tab - cancel and reopen - search should be empty', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        let picker = contentEditor.getPickerField('jdmix:imgView_image').open()
        picker.search('tab')
        picker.verifyResultsLength(1)
        picker.getTableRow('person-smartphone-office-table.jpg').should('be.visible')
        picker.cancel()
        contentEditor.cancel()

        picker = jcontent.editComponentByText('Leading by Example').getPickerField('jdmix:imgView_image').open()
        picker.getSearchInput().should('be.empty')
    })

    it('Editorial Picker- Search for tab - letter by letter', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:hasLink_internalLink').open()
        picker.search('t')
        picker.verifyResultsLength(82)
        picker.search('a')
        picker.verifyResultsLength(19)
        picker.search('b')
        picker.verifyResultsLength(7)
    })

    it('Editorial Picker- Search for tab - ensure all accordions are closed', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:hasLink_internalLink').open()
        picker.search('tab')
        picker.verifyResultsLength(1)
        picker.getTableRow('Taber').should('be.visible')
        picker.getAccordionItem('picker-pages').getHeader().should('have.attr', 'aria-expanded', 'false')
        picker.getAccordionItem('picker-content-folders').getHeader().should('have.attr', 'aria-expanded', 'false')
    })

    it('Editorial Picker- Search for tab and them empty search - ensure previous context is restored', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:hasLink_internalLink').open()
        picker.wait()

        picker.getTab("pages").click().then(tabItem => {
            picker.wait()
            picker.getTable().should('be.visible')
            cy.wrap(tabItem).should('have.class', 'moonstone-selected')
        })
        picker.search('tab')
        picker.verifyResultsLength(7)
        picker.search()
        
        // Selection is not able to expand yet in structured view
        // Verify tabs are visible and previous tab is selected
        picker.getTab("pages").should('have.class', 'moonstone-selected')
    })

    it('Media Picker- Search for xylophone and should find nothing no matter the context', () => {
        const contentEditor = jcontent.editComponentByText('Leading by Example')
        const picker = contentEditor.getPickerField('jdmix:imgView_image').open()
        picker.search('xylophone', true)
        picker.verifyResultsAreEmpty()
        picker.switchSearchContext('Media')
        picker.verifyResultsAreEmpty()
        picker.switchSearchContext('Digitall')
        picker.verifyResultsAreEmpty()
    })
})

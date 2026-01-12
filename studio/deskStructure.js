export const myStructure = (S) =>
  S.list()
    .title('Pages')
    .items([
        ...S.documentTypeListItems().filter(listItem => 
            ['konferenz'].includes(listItem.getId())
        ),

        S.listItem()
        .title('About')
        .child(
            S.document()
            .schemaType('about')
            .documentId('about')),
        S.listItem()
        .title('Organisation')
        .child(
            S.document()
            .schemaType('mitglieder')
            .documentId('mitglieder')),
        S.listItem()
        .title('Forderungen')
        .child(
            S.document()
            .schemaType('forderungen')
            .documentId('forderungen')),
        S.listItem()
        .title('Presse')
        .child(
            S.document()
            .schemaType('presse')
            .documentId('presse')),        
        S.listItem()
        .title('Kontakt')
        .child(
            S.document()
            .schemaType('contact')
            .documentId('contact')),
        S.listItem()
        .title('Datenschutz')
        .child(
            S.document()
            .schemaType('datenschutz')
            .documentId('datenschutz')),

        S.divider(),
        ...S.documentTypeListItems().filter(listItem => 
            ['person'].includes(listItem.getId())
        ),
        S.listItem()
        .title('Poster')
        .child(
            S.document()
            .schemaType('poster')
            .documentId('poster')),

        // ...S.documentTypeListItems()
    ])
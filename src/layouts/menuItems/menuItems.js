export default [
    {
        title: 'Home',
        route: 'home',
        icon: 'HomeIcon',
    },
    {
        title: 'Cases',
        route: 'cases-view-list',
        icon: 'FolderIcon',
        requiredScopes: ['st3.showcases']
    },
    {
        title: 'Schedules',
        route: 'manager-scheduler-user-blank',
        icon: 'CalendarIcon',
        requiredScopes: ['st3.showschedules']
    },
    {
        title: 'Clients',
        route: 'clients-view-list',
        icon: 'FileIcon',
        requiredScopes: ['st3.showclients']
    },
    {
        title: 'Insured',
        route: 'insured-view-list',
        icon: 'CreditCardIcon',
        requiredScopes: ['st3.showinsured']
    },
    {
        title: 'My Cases',
        route: 'my-cases',
        icon: 'FolderIcon',
        requiredUserTypes: ['User'],
        requiredScopes: ['st3.showinsured']
    },
    {
        title: 'Reporting',
        route: 'reports',
        icon: 'EyeIcon',
        requiredScopes: ['st3.showreporting']
    },
    {
        title: 'Reminders',
        route: 'reminders',
        icon: 'FolderIcon',
        requiredScopes: ['st3.closecase']
    },
    {
        title: 'Licenses',
        route: '',
        icon: 'FileIcon',
        children: [
            { title: 'Manage Licenses', icon:'none', route: 'licenses'},
            { title: 'Manage Scheduler', icon:'none', route: 'manager-members'},
        ],
        requiredScopes: ['st3.showlicenses']
    },
    {
        title: 'HR',
        route: '',
        icon: 'UserCheckIcon',
        children: [
            { title: 'Users', icon:'none', route: 'hr-users'},
        ],
        requiredScopes: ['st3.showhr']
    },
    {
        title: 'Admin',
        route: 'admin',
        icon: 'UsersIcon',
        children: [
            { title: 'Utility', icon:'none', route: 'admin-utility'},
            { title: 'Users & Permissions', icon:'none', route: 'admin-users-and-permissions'},
            { title: 'Templates', icon:'none', route:'templates', requiredScopes: ['st2.edittemplates']}
        ],
        requiredScopes: ['st3.showadminmenu']
    },
    {
        title: 'Accounting',
        route: 'accounting',
        icon: 'CreditCardIcon',
        requiredScopes: ['st3.viewlist'],
        children: [
            { title: 'Bulk Invoice Printing', icon:'none', route: 'bulk-invoice-printing'},
            { title: 'Invoice Summary', icon:'none', route: 'invoice-summary-list'},
            { title: 'Change Invoice Number', icon:'none', route:'change-invoice-number', requiredScopes: ['st2.changeinvoicenumber']}
        ]
    },
]

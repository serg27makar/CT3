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
        requiredScopes: ['st2.showcases']
    },
    {
        title: 'Schedules',
        route: 'manager-scheduler-user-blank',
        icon: 'CalendarIcon',
        requiredScopes: ['st2.showschedules']
    },
    {
        title: 'Clients',
        route: 'clients-view-list',
        icon: 'FileIcon',
        requiredScopes: ['st2.showclients']
    },
    {
        title: 'Insured',
        route: 'insured-view-list',
        icon: 'CreditCardIcon',
        requiredScopes: ['st2.showinsured']
    },
    {
        title: 'My Cases',
        route: 'my-cases',
        icon: 'FolderIcon',
        requiredUserTypes: ['User'],
        requiredScopes: ['st2.showinsured']
    },
    {
        title: 'Reporting',
        route: 'reports',
        icon: 'EyeIcon',
        requiredScopes: ['st2.showreporting']
    },
    {
        title: 'Reminders',
        route: 'reminders',
        icon: 'FolderIcon',
        requiredScopes: ['st2.closecase']
    },
    {
        title: 'Licenses',
        route: '',
        icon: 'FileIcon',
        children: [
            { title: 'Manage Licenses', icon:'none', route: 'licenses'},
            { title: 'Manage Scheduler', icon:'none', route: 'manager-members'},
        ],
        requiredScopes: ['st2.showlicenses']
    },
    {
        title: 'HR',
        route: '',
        icon: 'UserCheckIcon',
        children: [
            { title: 'Users', icon:'none', route: 'hr-users'},
        ],
        requiredScopes: ['st2.showhr']
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
        requiredScopes: ['st2.showadminmenu']
    },
    {
        title: 'Accounting',
        route: 'accounting',
        icon: 'CreditCardIcon',
        requiredScopes: ['st2.viewlist'],
        children: [
            { title: 'Bulk Invoice Printing', icon:'none', route: 'bulk-invoice-printing'},
            { title: 'Invoice Summary', icon:'none', route: 'invoice-summary-list'},
            { title: 'Change Invoice Number', icon:'none', route:'change-invoice-number', requiredScopes: ['st2.changeinvoicenumber']}
        ]
    },
]

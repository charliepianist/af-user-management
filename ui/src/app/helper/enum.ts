export class Enum {
    static readonly DISPLAY_TEXT = {
        CUSTOMER: {
            name: 'Name',
            userId: 'User ID',
            password: 'Password',
            clientType: 'Client Type',
            priority: 'Priority',
            disabled: 'Status',
            entitlements: 'Entitlements',
            numLogins: 'Logins',
            trialLengths: 'Trial Lengths'
        }
    }
    static readonly TOOLTIP = {
        CUSTOMER: {
            password: 'Password must have a lowercase and uppercase letter, number, and special character.',
            clientType: 'A customer can be a client (default), reporter, or administrator.',
            priority: 'Priority of the customer. The bigger the number, the lower the priority (highest priority: 1).',
            disabled: 'Status determines whether a customer receives subscriptions. Disabling a customer does not remove entitlements, but does stop the customer from receiving data.',
            entitlements: 'An entitlement is a granting of access to a product at a certain location, and can be a subscription or a trial.',
            numLogins: 'Number of simultaneous login sessions the user can have for a specific entitlement (default 2).',
            trialLengths: 'Set the end date to finish adding trials (note: trials do not automatically terminate).'
        }
    }
}
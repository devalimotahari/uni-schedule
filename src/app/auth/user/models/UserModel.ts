import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { User } from 'src/app/auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		id: '',
		role: null, // guest
		firstName: '',
		lastName: '',
		username: '',
		bankAccounts: [],
		cryptoAccounts: [],
		email: '',
		createdAt: 0,
		updatedAt: 0
	});
}

export default UserModel;

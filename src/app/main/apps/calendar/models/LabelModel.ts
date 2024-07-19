import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { ILabel } from '../calendarStore';

/**
 * The label model.
 */
function LabelModel(data?: PartialDeep<ILabel>): ILabel {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		color: '#e75931'
	});
}

export default LabelModel;

type GroupingCondition = {
	value: string | number | boolean;
	criterion: "EQUAL_STRINGS" | "STRING_INCLUDES" | "EQUAL_BOOLEANS" | "EQUAL_NUMBERS" | "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL";
	caseSensitive?: boolean;
	groupMeetsCriterion?: string;
	groupFailsCriterion?: string;
}

export function group<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: GroupingCondition) {

	const groupingObject: Record<string, T[]> = {};

	if (condition !== undefined) {

		const caseSensitive = condition.caseSensitive ?? true;
		const meetsCriterion = condition.groupMeetsCriterion ?? "passes";
		const failsCriterion = condition.groupFailsCriterion ?? "fails";

		if (condition.criterion === "EQUAL_BOOLEANS") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) === condition.value
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) !== condition.value
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "EQUAL_STRINGS") {
			const valueAsString = condition.value as string;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string) === valueAsString
				}
				return (element[attributeName] as unknown as string).toLowerCase() === valueAsString.toLowerCase()
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string) !== valueAsString
				}
				return (element[attributeName] as unknown as string).toLowerCase() !== valueAsString.toLowerCase()
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "STRING_INCLUDES") {
			const valueAsString = condition.value as string;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string).includes(valueAsString)
				}
				return (element[attributeName] as unknown as string).toLowerCase().includes(valueAsString.toLowerCase())
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
				return !(element[attributeName] as unknown as string).includes(valueAsString)
				}
				return !(element[attributeName] as unknown as string).toLowerCase().includes(valueAsString.toLowerCase())
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "EQUAL_NUMBERS") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) === valueAsNumber
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) !== valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "GREATER_THAN") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "GREATER_THAN_OR_EQUAL") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) >= valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) < valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "LESS_THAN") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) < valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) >= valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "LESS_THAN_OR_EQUAL") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		return groupingObject;
	}

	// Default grouping behavior
	const valuesForAttributeToGroupBy = collection.map(item => item[attributeName]);

	for (const attributeValue of valuesForAttributeToGroupBy) {
		const itemsGroup = collection.filter(item => item[attributeName] === attributeValue);

		const attributeValueAsAString = attributeValue as string;
		groupingObject[attributeValueAsAString] = itemsGroup;
	};

	return groupingObject;
}

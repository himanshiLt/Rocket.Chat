import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSubscription } from 'use-subscription';

import { selectedMessageStore } from '../../providers/SelectedMessagesProvider';

type SelectMessageContextValue = {
	selectedMessageStore: typeof selectedMessageStore;
};

export const SelectedMessageContext = createContext({
	selectedMessageStore,
} as SelectMessageContextValue);

export const useIsSelectedMessage = (mid: string): boolean => {
	const { selectedMessageStore } = useContext(SelectedMessageContext);
	const subscription = useMemo(
		() => ({
			getCurrentValue: () => selectedMessageStore.isSelected(mid),
			subscribe: (callback) => selectedMessageStore.on(mid, callback),
		}),
		[mid, selectedMessageStore],
	);

	return useSubscription(subscription);
};

export const useIsSelecting = (): boolean => {
	const { selectedMessageStore } = useContext(SelectedMessageContext);
	const [isSelecting, setIsSelecting] = useState<boolean>(selectedMessageStore.getIsSelecting());

	useEffect(() => selectedMessageStore.on('toggleSelect', setIsSelecting), [selectedMessageStore]);

	return isSelecting;
};

export const useToggleSelect = (mid: string) => {
	const { selectedMessageStore } = useContext(SelectedMessageContext);
	return useCallback(() => {
		selectedMessageStore.toggle(mid);
	}, [mid, selectedMessageStore]);
};
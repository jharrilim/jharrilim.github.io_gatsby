import { createContext } from 'react';

const defaultIndexContext = {
    hideHeader: true,
};

export const IndexContext = createContext(defaultIndexContext);

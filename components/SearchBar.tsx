import styles from '../styles/SearchBar.module.scss'
import SearchIcon from '@mui/icons-material/Search'
import { ForwardedRef, forwardRef } from 'react';

interface Props {
    className?: string
}

const SearchBar = ({ className }: Props, ref: ForwardedRef<HTMLInputElement>) => {
	return (
		<div className={`${styles.root} ${className}`}>
			<SearchIcon className={styles.icon} />
			<input ref={ref} type="search" placeholder="SEARCH" />
		</div>
	);
};

export default forwardRef<HTMLInputElement, Props>(SearchBar)
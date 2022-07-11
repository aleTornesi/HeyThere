import styles from '../styles/AddContactItem.module.scss'
import DefaultImage from '../public/default-avatar.png'
import Image from 'next/image'
import Button from './Button';
import useSWR from 'swr';

interface Props {
    contactFirstName: string,
    contactLastName: string,
    contactId: string,
    onClickAdd: () => void
}

const AddContactItem = ({ contactId, contactFirstName, contactLastName, onClickAdd }: Props) => {

    const { data: imageUrl } = useSWR(`api/users/${contactId}/image`, async (...args) => {
        const res = await fetch(...args);
        return await res.text();
    });

	return (
		<div className={styles.root}>
			<div>
				<Image
					className={`circle ${styles.hoverPointer}`}
                    src={imageUrl ?? DefaultImage}
                    alt="Profile picture"
					width={50}
					height={50}
				/>
                <h5>{contactFirstName} { contactLastName }</h5>
			</div>
            <Button bgColor="bg" onClick={onClickAdd}>
                ADD
            </Button>
		</div>
	);
};

export default AddContactItem
import styles from '../styles/AddContactItem.module.scss'
import DefaultImage from "../public/default-avatar.png";
import Image from "next/image";
import Button from "./Button";
import useSWR from "swr";
import { ObjectId } from 'mongodb';
import { useRef } from 'react';

interface Props {
	requestId: ObjectId,
	fromId: string
	fromName: string
}

const RequestItem = ({
	requestId,
	fromId,
	fromName
}: Props) => {

	const componentRef = useRef<HTMLDivElement>(null)

	return (
		<div ref={componentRef} className={styles.root}>
			<div>
				<Image
					className={`circle ${styles.hoverPointer}`}
					src={
						`http://localhost:3000/api/users/${fromId}/image` ?? DefaultImage
					}
					alt="Profile picture"
					width={50}
					height={50}
				/>
				<h5>{fromName}</h5>
			</div>
			<div>
				<Button
					bgColor="green"
					color="white"
					onClick={async () => {
						await fetch(`/api/friendshipRequests/${requestId}/isAccepted`, {
							method: "POST",
							headers: {
								"Content-type": "application/json",
							},
							body: "true",
						});
						componentRef.current?.remove();
					}}>
					ACCEPT
				</Button>
				<Button
					bgColor="red"
					color="white"
					onClick={async () => {
						await fetch(`/api/friendshipRequests/${requestId}/isAccepted`, {
							method: "POST",
							headers: {
								"Content-type": "application/json",
							},
							body: "false",
						});
						componentRef.current?.remove();
					}}>
					DECLINE
				</Button>
			</div>
		</div>
	);
};

export default RequestItem
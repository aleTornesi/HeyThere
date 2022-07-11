import styles from '../styles/FindContacts.module.scss'
import Canvas from "../components/Canvas"
import Navbar from "../components/Navbar"
import SearchBar from '../components/SearchBar'
import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0'
import useSWR from 'swr'
import { Fragment, useState } from 'react'
import IUser from '../interfaces/IUser'
import AddContactItem from '../components/AddContactItem'

export default withPageAuthRequired(({user}: {user: UserProfile}) => {

    const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    useSWR(`api/users/?notContacts`, async (...args) => {
        const res = await fetch(...args);
        const users = (await res.json()) as IUser[];
        setUsers(users);
    });

    console.log(user)

    return (
			<>
				<Navbar />
                <SearchBar className={styles.searchBar} />
				<Canvas className={styles.canvas}>
					{users?.length == 0 && <h3>There are no users available</h3>}
					{users?.map((contact, index) => (
						<Fragment key={index}>
							<AddContactItem
								contactId={contact._id}
								contactFirstName={contact.firstName}
								contactLastName={contact.lastName}
								onClickAdd={async () => {
									await fetch(`/api/friendshipRequests/`, {
										method: "POST",
										headers: {
											"Content-type": "application/json",
										},
										body: JSON.stringify({
											users: [contact._id],
											isGroup: false,
										}),
									});

									users?.splice(index, 1);
									setUsers(users);
								}}
							/>
							{index != users?.length - 1 && <hr />}
						</Fragment>
					))}
				</Canvas>
			</>
		);
})
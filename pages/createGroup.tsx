import { UserProfile, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import AddContactItem from "../components/AddContactItem";
import Button from "../components/Button";
import Canvas from "../components/Canvas"
import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar";
import { IContact } from "../interfaces/IUser";
import styles from '../styles/CreateGroup.module.scss'

export default withPageAuthRequired(({user}: {user: UserProfile}) => {
    const groupNameInputRef = useRef(null)

    const { data: contacts } = useSWR(`api/users/${user?.sub}/contacts`, async (...args) => {
        const res = await fetch(...args);
        return (await res.json()) as IContact[];
    });

    return (
        <>
            <Navbar />
			<div className={styles.root}>
                <div className={styles.flex}>
                    <div className={styles.input}>
                        <input
                            ref={groupNameInputRef}
                            type="search"
                            placeholder="GROUP NAME"
                        />
                    </div>
                    <Button bgColor="fg">
                        CREATE GROUP
                    </Button>
                </div>
                <SearchBar />
                <Canvas className={styles.canvas}>
                    {contacts?.length == 0 && <h1>You have no contacts</h1>}
                    {contacts?.map((contact) => (
                        <>
                            <AddContactItem contactId={contact._id} contactFirstName={contact.firstName} contactLastName={contact.lastName} onClickAdd={() => {
                                
                            }} />
                            <hr />
                        </>
                    ))}
                </Canvas>
			</div>
        </>
		);

})
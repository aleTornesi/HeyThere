import styles from '../styles/FriendshipRequests.module.scss'
import Canvas from "../components/Canvas"
import Navbar from "../components/Navbar"
import RequestItem from "../components/RequestItem"
import useSWR from 'swr'
import { UserProfile, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { IFriendshipRequest } from '../interfaces/IFriendShipRequest'
import { Fragment } from 'react'

export default withPageAuthRequired(({user}: {user: UserProfile}) => {

	const { data: requests } = useSWR(`/api/friendshipRequests?to=${user?.sub}&isAccepted=${null}`, async(...args) => {
		const res = await fetch(...args)
		return await res.json() as IFriendshipRequest[]
	})

	console.log(requests)

    return <>
        <Navbar />
		<Canvas className={styles.canvas}>
			{!requests && <div className='loader'></div>}
			{requests?.map((req, i) => (
				<Fragment key={i}>
					<RequestItem fromName={req.fromName} fromId={req.from} requestId={req._id} />
					{i < requests.length-1 && <hr/>}
				</Fragment>
			))}
        </Canvas>
    </>
})
import Link from 'next/link'
import styles from '../styles/Navbar.module.scss'
import SearchIcon from "@mui/icons-material/Search";
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import defaultPicture from '../public/default-avatar.png'
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from '@mui/material/Badge';
import useSWR from 'swr';
import { IFriendshipRequest } from '../interfaces/IFriendShipRequest';

const Navbar = () => {
	const router = useRouter()
	
	const { user } = useUser()

	const { data: friendshipRequests } = useSWR(`/api/friendshipRequests/?to=${user?.sub}`, async(...args) => {
		const res = await fetch(...args)
		return (await res.json()) as IFriendshipRequest[]
	})

    return (
			<div className={styles.root}>
				<Link href="/">
					<p className={router.pathname == "/" ? styles.active : ""}>Hey There</p>
				</Link>

				<div>
					<ul>
						<li>
							<Link href="/createGroup">
								<p className={router.pathname == "/createGroup" ? styles.active : ""}>
									Create group
								</p>
							</Link>
						</li>
						<li>
							<Link href="/findContacts">
								<p className={router.pathname == "/findContacts" ? styles.active : ""}>
									Find new contacts
								</p>
							</Link>
						</li>
						<li>
						<Link href="/friendshipRequests">
							<Badge badgeContent={friendshipRequests?.length} color="primary">
								<NotificationsIcon />
							</Badge>
							</Link>
						</li>
					</ul>
					<button>
						<SearchIcon />
					</button>
					<Image
						className={`${styles.circle} ${styles.hoverPointer}`}
						src={user?.picture ?? defaultPicture}
						alt="User's profile picture"
						width={50}
						height={50}
					/>
				</div>
			</div>
		);
}

export default Navbar
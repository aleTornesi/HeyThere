import { UserProfile, useUser, withPageAuthRequired, getAccessToken } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.scss'
import Navbar from '../components/Navbar'
import DefaultImage from '../public/default-avatar.png'
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import useSWR from 'swr'
import Image from 'next/image'
import IUser, { IContact } from '../interfaces/IUser'
import IChat, {IMessage} from '../interfaces/IMessage'
import { renderToString } from 'react-dom/server'
import io from 'socket.io-client'
import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Canvas from '../components/Canvas'
import SearchBar from '../components/SearchBar'
import Button from '../components/Button'

export default withPageAuthRequired(({ user }: { user: UserProfile }) => {

	const { data } = useSWR(`api/users/${user.sub}`, async(...args) => {
		const res = await fetch(...args)
		return await res.json() as IUser
	})

  	const [selectedChat, setSelectedChat] = useState<string | undefined>(undefined)
	
  if (user)
    return (
			<>
				<Navbar />
				<div className={styles.rootOperations}>
					<SearchBar />

					<Button bgColor="bg">CLEAR CHAT</Button>
				</div>
				<div className={styles.content}>
					<Canvas className={styles.contacts}>
						{data?.contacts.length == 0 && <h3>You don&apos;t have any contacts</h3>}
						{data?.contacts.map(
							(value: IContact, index: number, array: IContact[]) => (
								<div
									key={value._id}
									onClick={() => {
										setSelectedChat(value._id);
									}}>
									<div>
										<div>
											<Image
												className="circle"
												src={value.img ?? DefaultImage}
												alt="Profile picture"
												width={50}
												height={50}
											/>
											<div>
												<p>{`${value.firstName} ${value.lastName}`}</p>
												<p className={styles.lastMessage}>
													{value.lastMessage?.content}
												</p>
											</div>
										</div>
										<p className={styles.time}>09:35</p>
									</div>

									{index < array.length - 1 && <hr />}
								</div>
							)
						)}
					</Canvas>
					<Chat user={user} contactId={selectedChat} />
				</div>
			</>
		);
  return (
    <>
    </>
  )
})

interface ChatProps {
	user: UserProfile | undefined,
	contactId: string | undefined
}

const Chat = ({ user, contactId }: ChatProps) => {

	let ws: Socket<DefaultEventsMap, DefaultEventsMap> | undefined = undefined

	const messageInputRef = useRef<HTMLInputElement>(null)
	const messagesDivRef = useRef<HTMLDivElement>(null)
	
	useEffect(() => {
		if(messagesDivRef.current)
			messagesDivRef.current!.innerHTML = ""
		fetch(`/api/chats/${contactId}`).then(async res => {
			const body = await res.text() //the API will return a JWT which we used for authentication in the WS

			ws = io({
				query: {
					contactId: contactId,
				},
				auth: {
					token: body,
				},
			});

			ws.on("initialMessages", chatJSON => {
				const chat: IChat = JSON.parse(chatJSON);

				chat.messages.map((message: IMessage) => {
					messagesDivRef.current?.insertAdjacentHTML(
						"beforeend",
						renderToString(
							<div
								className={`${styles.message} ${
									message.sender == user?.sub ? styles.sent : styles.recieved
								}`}>
								{message.content}
							</div>
						)
					);
				});
			});

			ws.on("message", message => {
				messagesDivRef.current?.insertAdjacentHTML(
					"beforeend",
					renderToString(
						<div className={`${styles.message} ${styles.sent}`}>{message}</div>
					)
				);
			});

			ws.on("message-sent", message => {
				messagesDivRef.current?.insertAdjacentHTML(
					"beforeend",
					renderToString(
						<div className={`${styles.message} ${styles.sent}`}>{message}</div>
					)
				);
			});
		});
	}, [contactId])

	


	
	const sendMessage = () => {
		if (messageInputRef.current?.value) {
			ws?.emit('send-message', messageInputRef.current.value)
			messageInputRef.current.value = ""
		}
	}

  if (!contactId) return <Canvas className={styles.chat}><h4>You haven&apos;t selected any chat</h4></Canvas> 
  return (
		<Canvas className={styles.chat}>
			<div className={styles.inputMessage}>
				<div className={styles.inputIcons}>
					<button>
						<EmojiEmotionsIcon className={styles.icon} />
					</button>
				  <input ref={messageInputRef} type="search" placeholder="SEARCH"
					  onKeyUp={(e) => {
						  if (e.key == 'Enter') {
							  sendMessage()
						  }
					  }}
				  />
				</div>
				<button onClick={sendMessage}>
					<SendIcon />
				</button>
		  	</div>
		 	<div ref={messagesDivRef} className={styles.messages}>
			</div>
		</Canvas>
	);
}

import { ReactNode } from 'react'
import styles from '../styles/Canvas.module.scss'

interface Props {
    className?: string
    children: ReactNode
}

const Canvas = ({className, children}: Props) => {
    return <div className={`${styles.root} ${className}`}>
        {children}
    </div>
}

export default Canvas
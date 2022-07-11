import styles from '../styles/Button.module.scss'
import { forwardRef, ReactNode } from 'react'

interface Props {
    bgColor: "fg" | "bg" | string,
    color?: string,
    onClick?: () => any,
    children: ReactNode
}

const Button = ({ color = 'black', bgColor, onClick, children }: Props) => {
    if (bgColor != 'fg' && bgColor != 'bg')
        return <button onClick={onClick} className={`${styles.root}`} style={{backgroundColor: bgColor, color: color}}>
            {children}
        </button>
    return <button onClick={onClick} className={`${styles.root} ${bgColor == 'fg' ? styles.fg : styles.bg}`}>
        {children}
    </button>
}

export default Button
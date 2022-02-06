import styles from "../../styles/ItemCard.module.css";

export default function getIcon(type, file, className, imageClass) {
    switch (type) {
        case 'image': {
            if (file.preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                    <img src={file?.preview}  draggable={false} alt={'image'} className={styles.image}/>
                        <div className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>image</span>
                        </div>
                    </div>
                )
            return (
                <span className={'material-icons-round'}>image</span>
            )
        }

        case 'material':
            if (file.preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                        <img src={file?.preview}  draggable={false} alt={'image'} className={styles.image}/>
                        <div className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>texture</span>
                        </div>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>texture</span>
                </div>
            )
        case 'mesh':

            if (file.preview)
                return (
                    <div style={{position: 'relative'}} className={imageClass}>
                        <img src={file?.preview}  draggable={false} alt={'image'} className={styles.image}/>
                        <div className={styles.floatingIcon}>
                            <span style={{fontSize: '1rem'}} className={'material-icons-round'}>view_in_ar</span>
                        </div>
                    </div>
                )
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>view_in_ar</span>
                </div>
            )
        case 'Folder': {
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>folder</span>
                </div>
            )
        }
        default:
            return (
                <div className={[styles.icon, className].join(' ')}>
                    <span className={'material-icons-round'}>description</span>
                </div>
            )
    }
}

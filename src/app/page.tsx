import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p>
					<Link href='/orders'>
						Navigate to&nbsp;
						<code className={styles.code}>Orders</code>
					</Link>
				</p>
				<div></div>
			</div>

			<div className={styles.center}>
				<Image
					className={styles.logo}
					src='/next.svg'
					alt='Next.js Logo'
					width={180}
					height={37}
					priority
				/>
			</div>

			<div className={styles.grid}></div>
		</main>
	);
}

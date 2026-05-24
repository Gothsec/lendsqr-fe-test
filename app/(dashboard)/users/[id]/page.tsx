import styles from './page.module.scss'

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <div className={styles.container}>User {id}</div>
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  //Simulate Page loading
  await new Promise((r) => setTimeout(r, 3000));

  return <div>Topic Page: {id}</div>;
}

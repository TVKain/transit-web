function RedirectToDefaultRegion() {
    const { regions } = useLoaderData();
    if (regions.length > 0) {
        return <Navigate to={`/home/${regions[0].id}`} />;
    }
    return <div>Loading...</div>;
}
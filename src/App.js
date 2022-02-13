import {Navbar, Container} from 'react-bootstrap'
import {
    Routes,
    Route,
    Link,
} from 'react-router-dom'
import List from './components/List'
import Item from './components/Item'

function App() {
    return (<>
        <header className="header">
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Link to="/" className="navbar-brand">BDF Test App</Link>
                </Container>
            </Navbar>
        </header>
        <main className="main py-3">
            <Container>
                <Routes>
                    <Route path="/" element={<List />} />
                    <Route path="/:symbol" element={<Item />} />
                </Routes>
            </Container>
        </main>
        <footer className="footer">
            <Container className="text-muted">
                    &copy; 2022
            </Container>
        </footer>
    </>)
}

export default App

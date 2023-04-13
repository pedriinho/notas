import { montar_notas } from './getScoresStudents.js';
import './Loading.css'
// import './Tabelas.css'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
        '&:focus': {
          width: '25ch',
        },
      },
    },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        position: 'relative',
        top: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        position: 'sticky   ',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function App() {
    const [notas, setNotas] = React.useState(null);
    const [notasFiltradas, setNotasFiltradas] = React.useState(null);

    React.useEffect(() => {
        async function buscarDados() {
            var notas_temporarias = [];
            const notas = await montar_notas();
            for(let i = 0; i < notas.names.length; i++){
                var dados = {
                    "name": notas.names[i],
                    "turma": "null",
                    "id": notas.id[i],
                    "ab1": notas.ab1[i],
                    "ab2": notas.ab2[i],
                    "reav": notas.reav[i],
                    "final": notas.final[i],
                    "mean": notas.mean[i],
                    "situation": notas.situation[i]
                }
                notas_temporarias.push(dados);
            }
            setNotas(notas_temporarias);
        }

        buscarDados();
    }, []);

    function filtrar_notas(nome){
        var nota_temporaria = [];
        notas.map((nota) => {
            if(nota.name.toLowerCase().includes(nome.toLowerCase())){
                nota_temporaria.push(nota)
            }
        })
        setNotasFiltradas(nota_temporaria);
    }

    if (notas === null) {
        return (
            <div className="loading">
                <div className="loading-text"><strong>Carregando...</strong></div>
                <div className="loading-spinner"></div>
            </div>
        );
    } else {
        return (
            <div>
            <Box sx={{ flexGrow: 1, borderBottomStyle: 'double'}}>
                <AppBar position="static" sx={{backgroundColor:'black'}}>
                    <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }}}
                    >
                        <strong>Notas de Programação 1</strong>
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                        <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                        placeholder="Pesquisar nome..."
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={(e) => {filtrar_notas(e.target.value)}}
                        />
                    </Search>
                    </Toolbar>
                </AppBar>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center"><strong>Nome</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Turma</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Ab1</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Ab2</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Reav</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Final</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Média</strong></StyledTableCell>
                            <StyledTableCell align="center"><strong>Situação</strong></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !!notasFiltradas === false ? 
                                notas.map((nota) => (
                                    <StyledTableRow key={nota.id}>
                                    <StyledTableCell component="th" scope="nota">{nota.name}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.turma}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.ab1.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.ab2.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.reav.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.final.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.mean.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.situation}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                                :
                                notasFiltradas.map((nota) => (
                                    <StyledTableRow key={nota.id}>
                                    <StyledTableCell component="th" scope="nota">{nota.name}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.turma}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.ab1.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.ab2.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.reav.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.final.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.mean.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="center">{nota.situation}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            </div>
        );
    }
}

export default App;

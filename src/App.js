import { montar_notas } from './getScoresStudents.js';
import './Loading.css'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function App() {
    const [notas, setNotas] = React.useState(null);

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

    if (notas === null) {
        console.log('entrou')
        return (

            <div className="loading">
                <div className="loading-text"><strong>Carregando...</strong></div>
                <div className="loading-spinner"></div>
            </div>
            
        );
    } else {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
                        {notas.map((nota) => (
                            <StyledTableRow key={nota.name}>
                            <StyledTableCell component="th" scope="nota">{nota.name}</StyledTableCell>
                            <StyledTableCell align="center">{nota.turma}</StyledTableCell>
                            <StyledTableCell align="center">{nota.ab1.toFixed(2)}</StyledTableCell>
                            <StyledTableCell align="center">{nota.ab2.toFixed(2)}</StyledTableCell>
                            <StyledTableCell align="center">{nota.reav.toFixed(2)}</StyledTableCell>
                            <StyledTableCell align="center">{nota.final.toFixed(2)}</StyledTableCell>
                            <StyledTableCell align="center">{nota.mean.toFixed(2)}</StyledTableCell>
                            <StyledTableCell align="center">{nota.situation}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default App;

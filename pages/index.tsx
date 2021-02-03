import * as React from 'react'
import FilterListIcon from '@material-ui/icons/FilterList'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import {
    Box,
    Container,
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core'

import { formatRelative, subHours, isWithinInterval } from 'date-fns'
import {
    VictoryAxis,
    VictoryBrushContainer,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryScatter,
} from 'victory'

import { NewsType } from '../models/news.model'

export const calcWordFreq = (
    statistics: NewsType[],
    startTime: Date | number,
    endTime: Date | number,
    slice?: number,
    alphaSort?: boolean
) => {
    let start = new Date(startTime)
    let end = new Date(endTime)

    let stats = statistics
        .reduce((acc: NewsType['stats'][], stat) => {
            let currTime = new Date(stat.dateTime)
            if (start <= currTime && currTime <= end) acc.push(stat.stats)
            return acc
        }, [])
        .flat()
        .reduce((acc: NewsType['stats'], stat) => {
            let count = acc.find((k) => k.word === stat.word)
            if (count) {
                ++count.frequency
            } else {
                acc.push({ word: stat.word, frequency: 1 })
            }
            return acc
        }, [])
        .sort((a, b) => a.frequency - b.frequency)

    // number of words to be returned
    stats = stats.slice(slice || 10)
    // alphaSort remaining array in alphabetical order
    if (alphaSort)
        stats = stats.sort((a, b) => {
            if (a.word < b.word) return -1
            if (a.word > b.word) return 1
            return 0
        })

    return stats
}

const Index = () => {
    const [isLoaded, setIsLoaded] = React.useState<{
        isLoaded: boolean
        error: any
    }>({ isLoaded: false, error: null })
    const [news, setNews] = React.useState<NewsType[]>([])

    let newsParams = {
        pageSize: 90,
        statSize: 15,
    }

    React.useEffect(() => {
        fetch(
            `api/news?pageSize=${newsParams.pageSize}&statSize=${newsParams.statSize}`
        )
            .then((res) => {
                return res.json()
            })
            .then(
                (newsData: NewsType[]) => {
                    setIsLoaded({ ...isLoaded, isLoaded: true })
                    setNews(newsData)
                },
                (error) => {
                    setIsLoaded({ isLoaded: true, error: error })
                }
            )
    }, [])

    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                Word x Sentiment Analysis
            </Typography>
            <Typography variant="h5" gutterBottom>
                Word X frequency chart
            </Typography>
            <br />
            <Box>
                {isLoaded.error ? (
                    <Typography variant="h4" color="error">
                        {isLoaded.error}
                    </Typography>
                ) : !isLoaded.isLoaded ? (
                    <CircularProgress />
                ) : (
                    <WordVis news={news} />
                )}
            </Box>
        </Container>
    )
}

export default Index

export const WordVis = ({ news }: { news: NewsType[] }) => {
    const [selected, setSelected] = React.useState<{
        x: [Date, Date] | [number, number]
    }>({
        x: [subHours(new Date(), 8), subHours(new Date(), 1)],
    })
    const [alphaSort, setAlphaSort] = React.useState(true)

    let data = calcWordFreq(
        news,
        new Date(selected.x[0]),
        new Date(selected.x[1]),
        -20,
        alphaSort
    )

    return (
        <div>
            <Box>
                <Box display="flex" justifyContent="space-between">
                    <Box display="flex">
                        <Typography display="inline">
                            <Box color="#A069D0">
                                {formatRelative(selected.x[0], new Date())}
                            </Box>
                        </Typography>
                        <ArrowForwardIcon color="disabled" />
                        <Typography display="inline">
                            <Box color="#FF6C9D">
                                {formatRelative(selected.x[1], new Date())}
                            </Box>
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<FilterListIcon />}
                        style={{ borderRadius: '30px' }}
                        onClick={() => setAlphaSort(!alphaSort)}
                    >
                        Sort
                    </Button>
                </Box>

                <VictoryChart
                    domainPadding={30}
                    width={1000}
                    animate={{ duration: 650 }}
                >
                    <VictoryAxis
                        tickLabelComponent={<VictoryLabel angle={-90} />}
                        style={{
                            axis: { opacity: 0 },
                            tickLabels: {
                                transform: 'translate(-16 0)',
                            },
                            grid: {
                                stroke: '#A9BEF2',
                                opacity: 0.48,
                                pointerEvents: 'painted',
                            },
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{
                            axis: {
                                stroke: '#fff',
                                opacity: 0,
                                fontWeight: 100,
                            },
                            tickLabels: {
                                padding: 15,
                                fill: '#A069D0',
                                fontWeight: 100,
                            },
                        }}
                    />
                    <VictoryLine
                        x="word"
                        y="frequency"
                        interpolation="natural"
                        data={data}
                        style={{
                            data: {
                                stroke: alphaSort ? '#A069D0' : '#FF6C9D',
                                strokeWidth: 4,
                            },
                        }}
                    />
                    <VictoryScatter
                        x="word"
                        y="frequency"
                        data={data}
                        size={5}
                        style={{
                            data: {
                                fill: '#fff',
                                stroke: alphaSort ? '#A069D0' : '#FF6C9D',
                                strokeWidth: 4,
                            },
                        }}
                    />
                </VictoryChart>

                <br />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    padding="0px 50px"
                >
                    <Box color="#A069D0">
                        <Typography variant="overline">Yesterday</Typography>
                    </Box>
                    <Box color="#FF6C9D">
                        <Typography variant="overline">Today</Typography>
                    </Box>
                </Box>
            </Box>

            <br />
            {/* Scrub bar */}
            <Box>
                <VictoryChart
                    width={1000}
                    height={100}
                    scale={{ x: 'time' }}
                    padding={{ top: 0, left: 50, right: 50, bottom: 60 }}
                    containerComponent={
                        <VictoryBrushContainer
                            brushDimension="x"
                            brushDomain={selected}
                            onBrushDomainChange={setSelected}
                            brushStyle={{
                                fill: 'url(#myGradient)',
                                // @ts-ignore
                                rx: 12,
                                height: 24,
                            }}
                        />
                    }
                    domainPadding={30}
                >
                    <VictoryAxis
                        tickValues={Array.apply(null, Array(24)).map(
                            (value, index) => {
                                let t = new Date()
                                t.setDate(t.getDate() - 1)
                                t.setHours(t.getHours() + index + 1)
                                return t
                            }
                        )}
                        offsetY={87}
                        tickFormat={(x) => new Date(x).getHours()}
                        style={{
                            axis: {
                                stroke: '#FF8A85',
                                opacity: 0.5,
                                strokeWidth: 6,
                            },
                            tickLabels: {
                                padding: 25,
                                fill: ({ tick }) =>
                                    isWithinInterval(new Date(tick), {
                                        start: new Date(selected.x[0]),
                                        end: new Date(selected.x[1]),
                                    })
                                        ? '#A069D0'
                                        : '#464444',
                                fontWeight: ({ tick }) =>
                                    isWithinInterval(new Date(tick), {
                                        start: new Date(selected.x[0]),
                                        end: new Date(selected.x[1]),
                                    })
                                        ? '600'
                                        : '100',
                            },
                        }}
                    />
                </VictoryChart>
            </Box>

            {/*svg gradient*/}
            <svg style={{ height: 0 }}>
                <defs>
                    <linearGradient id="myGradient">
                        <stop offset="0%" stopColor="#A069D0" />
                        <stop offset="100%" stopColor="#FF6C9F" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

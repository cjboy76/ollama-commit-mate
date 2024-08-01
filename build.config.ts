import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [{
        input: 'src/command/cm',
        name: 'index'
    }],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
    }
})
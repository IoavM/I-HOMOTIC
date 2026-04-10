import { useTranslation } from 'react-i18next'

interface Props {
    valor: string
    etiquetaKey: string
}

export default function TarjetaDato({ valor, etiquetaKey }: Props) {
    const { t } = useTranslation()

    return (
        <div className='dato'>
            <h3>{valor}</h3>
            <p>{t(etiquetaKey)}</p>
        </div>
    )
}
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { ImageContainer } from "../styles/pages/success";
import { SucessContainer } from "../styles/pages/success";

interface SuccessProps {
    customerName: string;
    product: {
        name: string;
        imageUrl: string;
    }
}

export default function Success( { customerName, product }: SuccessProps ) {
    return (
        <>
        <Head>
            <title>Order Success!</title>

            <meta name="robots" content="noindex" />
        </Head>

            <SucessContainer>
                <h1>Order completed !</h1>

                <ImageContainer>
                    <Image src={product.imageUrl} width={120} height={120} alt="" />
                </ImageContainer>

                <p>
                    <strong>{ customerName } </strong>
                    your <strong>{product.name}</strong> is coming up to you !
                </p>

                <Link href="/">
                    Voltar ao catálogo
                </Link>
            </SucessContainer>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ query, params }) => {
    
    if (!query.session_id) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }
    
    const sessionId = String(query.session_id);

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'line_items.data.price.product']
    })

    console.log(session.line_items.data[0].price)

    const customerName = session.customer_details.name;
    const product = session.line_items.data[0].price.product as Stripe.Product;

    return {
        props: {
            customerName,
            product: {
                name: product.name,
                imageUrl: product.images[0],
            }         
        }
    }
}
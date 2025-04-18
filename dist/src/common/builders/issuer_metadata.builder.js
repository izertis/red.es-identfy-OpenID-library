import { v4 as uuidv4 } from 'uuid';
import { isHttps } from '../utils/index.js';
import { InternalError } from '../classes/index.js';
/**
 * Builder class for Credential Issuer Metadata
 */
export class IssuerMetadataBuilder {
    /**
     * Constructor of IssuerMetadataBuilder
     * @param credential_issuer URI of the credential issuer
     * @param credential_endpoint Credential issuer endpoint in which credential
     * request should be sended
     * @param imposeHttps Flag that indicates if the builder should check if
     * the provided URL are HTTPS
     * @throws if imposeHttps is true an a not HTTPS URI is provided
     */
    constructor(credential_issuer, credential_endpoint, imposeHttps = true) {
        this.credential_issuer = credential_issuer;
        this.credential_endpoint = credential_endpoint;
        this.imposeHttps = imposeHttps;
        this.credentials_supported = new Map();
        if (imposeHttps) {
            if (!isHttps(credential_issuer)) {
                throw new InternalError("Is not https");
            }
            if (!isHttps(credential_endpoint)) {
                throw new InternalError("Is not https");
            }
        }
    }
    assertUrlIsHttps(url, assertedParameter) {
        if (this.imposeHttps) {
            if (!isHttps(url)) {
                throw new InternalError(`${assertedParameter} is not https`);
            }
        }
    }
    /**
     * Set authorization server paramater for issuer metadata
     * @param url URI of the authorization server
     * @returns This object
     */
    withAuthorizationServer(url) {
        this.assertUrlIsHttps(url, "authorization_server");
        this.authorization_server = url;
        return this;
    }
    /**
     * Set deferred credential endpoint paramater for issuer metadata
     * @param url Endpoint for deferred credentials
     * @returns This object
     */
    withDeferredCredentialEndpoint(url) {
        this.assertUrlIsHttps(url, "deferred_credential_endpoint");
        this.deferred_credential_endpoint = url;
        return this;
    }
    /**
     * Set batch credential endpoint paramater for issuer metadata
     * @param url Endpoint fot batch credentials issuance
     * @returns This object
     */
    withBatchCredentialEndpoint(url) {
        this.assertUrlIsHttps(url, "batch_credential_endpoint");
        this.batch_credential_endpoint = url;
        return this;
    }
    /**
     * Add a new credential supported for issuer metadata
     * @param supportedCredential Credential specification
     * @returns This object
     * @throws If the credential already exists
     */
    addCredentialSupported(supportedCredential) {
        let id;
        if (!supportedCredential.id) {
            id = uuidv4();
        }
        else {
            if (this.credentials_supported.get(supportedCredential.id)) {
                throw new InternalError("Credential supported already defined");
            }
            id = supportedCredential.id;
        }
        this.credentials_supported.set(id, supportedCredential);
        return this;
    }
    /**
     * Generate IssuerMetadata from the data contained in the builder
     * @returns IssuerMetadata instance
     */
    build() {
        return {
            credential_issuer: this.credential_issuer,
            authorization_server: this.authorization_server,
            credential_endpoint: this.credential_endpoint,
            deferred_credential_endpoint: this.deferred_credential_endpoint,
            batch_credential_endpoint: this.batch_credential_endpoint,
            credentials_supported: Array.from(this.credentials_supported.values())
        };
        ;
    }
}
/**
 * Builder class for Credential Supported objects in Credential Issuer Metadata
 */
export class CredentialSupportedBuilder {
    constructor() {
        this.format = "jwt_vc_json";
        this.types = [];
    }
    /**
     * Set the format of the credential. By default "jwt_vc_json".
     * @param format The W3C VC format
     * @returns This object
     */
    withFormat(format) {
        this.format = format;
        return this;
    }
    /**
     * Set the ID of the credential
     * @param id The id of the credential
     * @returns This object
     */
    withId(id) {
        this.id = id;
        return this;
    }
    /**
     * Set the types of the credential
     * @param types The types of the credentials
     * @returns This object
     */
    withTypes(types) {
        this.types = types;
        return this;
    }
    /**
     * Add display information for the credential
     * @param display Information of how to display the credential
     * @returns This object
     */
    addDisplay(display) {
        if (!this.display) {
            this.display = [];
        }
        this.display.push(display);
        return this;
    }
    /**
     * Generate CredentialSupported from the data contained in this builder
     * @returns CredentialSupported instance
     */
    build() {
        return {
            format: this.format,
            id: this.id,
            types: this.types,
            display: this.display
        };
    }
}
/**
 * Builder for VC display information in CredentialSupported objects
 */
export class VerifiableCredentialDisplayBuilder {
    /**
     * Constructor of VerifiableCredentialDisplayBuilder
     * @param name String value of a display name for the Credential Issuer.
     */
    constructor(name) {
        this.name = name;
    }
    /**
     * Set the locale information of the display information
     * @param locale String value that identifies the language of this object
     * represented as a language tag taken from values defined in BCP47
     * @returns This object
     */
    withLocale(locale) {
        this.locale = locale;
        return this;
    }
    /**
     * Set the logo information of the display information
     * @param logo Logo information
     * @returns This object
     */
    withLogo(logo) {
        this.logo = logo;
        return this;
    }
    /**
     * Set the "url" attribute of the display information
     * @param url The URL itself
     * @returns This object
     */
    withUrl(url) {
        this.url = url;
        return this;
    }
    /**
     * Set the "alt_text" attribute of the display information
     * @param text The text for the attribute
     * @returns This object
     */
    withAltText(text) {
        this.alt_text = text;
        return this;
    }
    /**
     * Set the "description" attribute of the display information
     * @param description The description to include
     * @returns This object
     */
    withDescription(description) {
        this.description = description;
        return this;
    }
    /**
     * Set the "background_color" attribute of the display information
     * @param color The color to include
     * @returns This object
     */
    withBackgroundColor(color) {
        this.background_color = color;
        return this;
    }
    /**
     * Set the "text_color" attribute of the display information
     * @param textColor The color to include
     * @returns This object
     */
    withTextColor(textColor) {
        this.text_color = textColor;
        return this;
    }
    /**
     * Generate VerifiableCredentialDisplay object from the data contained in the builder
     * @returns VerifiableCredentialDisplay instance
     */
    build() {
        return {
            name: this.name,
            locale: this.locale,
            logo: this.logo,
            url: this.url,
            alt_text: this.alt_text,
            description: this.description,
            background_color: this.background_color,
            text_color: this.text_color
        };
    }
}
